# ThaiViet Template-Registry CMS — Design Spec

**Date:** 2026-07-05
**Status:** Approved design → ready for implementation plan
**Author:** brainstorming session

## 1. Goal

Let ThaiViet admin staff build service and project pages by **choosing a code-defined
layout template and filling its fields**, then publishing to the live site — instead of
content being hardcoded. Also reskin the public **Home** page to the new design.

Source of the templates and the admin UX: the claude.ai design project
`5923c23a-5fef-4b8c-99b9-2e74cdd09651`, files `ThaiViet Home.dc.html` and
`ThaiViet Dashboard.dc.html` (readable via the `DesignSync` tool during implementation).

## 2. Scope

**In scope**
- Public **Home** reskin to `ThaiViet Home.dc.html` (one-off; Home stays non-templated).
- **Service pages**: a global *layout style* selector over the existing shared
  `ServiceDetail` content. One selection applies to all 8 service detail pages. **Ship Style
  A (current layout) + Style B (Cinematic/Dark) now; C/D/E are a follow-up** — the selector
  and registry are built for all five, only three renderers are deferred.
- **Projects**: a per-item *compose wizard* (pick template → build with live preview →
  publish). 5 project templates with per-template field schemas. Makes project detail
  pages admin-editable for the first time.
- Admin CMS wiring for both, matching the dashboard mockup, plus docs updates.

**Out of scope (note explicitly)**
- **Blog** compose templates — the wizard is built kind-agnostic so blog can be added
  later, but no blog templates ship in this project.
- **Messages/chat** panel shown in the dashboard mockup (separate feature).
- Admin-authored templates / page builder (templates are developer-defined, per decision).
- Multi-tenant / public user accounts (single-tenant admin only).
- New Supabase tables — everything stays in the existing single `site_content` blob.

## 3. Baseline (current architecture)

- Content is one `SiteContent` object (`src/pages/admin/useAdminContent.ts`) stored as a
  single row in Supabase `site_content` and bundled as `src/content/site-content.json`.
- `withContentDefaults` (`src/lib/content-defaults.ts`) merges bundled defaults over the
  live row, so **older rows never break when we add keys** — the migration lever we rely on.
- Admin store: typed reducer + `update*` helpers (`src/pages/admin/admin-content-store.tsx`).
  `serviceDetails`/`home`/`homepage` use dedicated section editors; `projects`/`posts` use a
  generic edit drawer. Publish upserts the whole blob, gated by `validateContent`
  (`src/lib/content-schema.ts`).
- Public pages read via `useSiteContent()`. `ServiceDetailPage` renders one fixed layout
  from a `ServiceDetail`. `ProjectDetailPage` reads **static** `data/project-details.ts`
  (NOT in `SiteContent`, NOT editable) with fallback to the project card fields.

## 4. Architecture — two registries

### 4.1 Service-skin registry (global layout style)

One shared content schema (`ServiceDetail`, unchanged), five **skin renderers** that lay the
same data out differently. Admin picks one style globally; it applies to every service page.

- New global field `serviceStyle: ServiceStyleId` on `SiteContent` (default `'A'`).
- `ServiceStyleId = 'A' | 'B' | 'C' | 'D' | 'E'` with design names:
  A Editorial/Light, B Cinematic/Dark, C Structured/Grid, D Soft/Minimal, E Bold/Poster.
- `serviceSkins: Record<ServiceStyleId, FC<{ s: ServiceDetail; contact: Contact }>>`.
- **Style A reproduces the current `ServiceDetailPage` layout** (warm cream, magazine grid,
  before/after) → default selection = zero visual change for existing content.
- `ServiceDetailPage` becomes a thin dispatcher: `serviceSkins[serviceStyle](s, contact)`.

### 4.2 Project-template registry (per-item fields)

Each template is a self-contained module: **meta shape + section schema + default content +
renderer + validation**. The renderer is reused for the public page and the admin live preview.

```ts
// Field-kind model extracted from the dashboard design
type TemplateValue = string | Record<string, string> | Array<Record<string, string>>;

interface SectionDef {
  key: string;                 // stable storage key
  kind: 'text' | 'pair' | 'repeat';
  style: 'rule' | 'quote' | 'author' | 'plain'   // text
       | 'beforeafter'                            // pair
       | 'steps' | 'gallery' | 'highlights';      // repeat
  title: string;               // admin form group label
  heading?: string;            // public section heading (text)
  label?: string;              // single-field label (text)
  area?: boolean;              // textarea vs input (text / repeat sub-field)
  fields?: { key: string; label: string; area?: boolean }[]; // pair / repeat sub-fields
  itemLabel?: string; addLabel?: string;                     // repeat
  default: TemplateValue;      // seed content when the template is picked
}

interface ProjectMeta {
  title: string; category: string; location: string;
  duration: string; year: string; cover: string; intro: string;
}

interface ProjectTemplateDef {
  id: ProjectTemplateId;       // 'casestudy' | 'beforeafter' | 'timeline' | 'photostory' | 'spotlight'
  name: string; icon: string; desc: string; // picker card
  includes: string[];          // picker card chips ("Facts","Challenge",…)
  defaultMeta: ProjectMeta;    // seed facts + cover + intro
  sections: SectionDef[];
  Renderer: FC<{ meta: ProjectMeta; values: Record<string, TemplateValue>; contact: Contact }>;
}
```

- Registry: `projectTemplates: Record<ProjectTemplateId, ProjectTemplateDef>` +
  `projectTemplateList` (ordered, for the picker).
- The 5 templates and their exact default copy come straight from the design
  (`composeTemplatesData()`), extracted during implementation.

### 4.3 File layout

```
src/lib/templates/
  types.ts                 // SectionDef, TemplateValue, ProjectMeta, *Id unions, defs
  project/
    index.ts               // projectTemplates registry + list
    casestudy.tsx  beforeafter.tsx  timeline.tsx  photostory.tsx  spotlight.tsx
    sections.tsx           // shared renderers for text/pair/repeat section kinds
  service/
    index.ts               // serviceSkins registry
    skin-a.tsx … skin-e.tsx
src/pages/admin/sections/
  ComposeWizard.tsx        // 2-step pick→build; kind-agnostic (project now, blog later)
  compose/ TemplatePicker.tsx  TemplateForm.tsx  TemplatePreview.tsx
  ServiceStyleEditor.tsx   // 5-style global selector (replaces/augments Service Pages section)
```

Every file stays under the 200-line guideline; large templates split their renderer from
their section wiring via `sections.tsx`.

## 5. Data model changes (`src/lib/types.ts`, `SiteContent`)

```ts
// NEW: templated project detail payload (present when created/edited via a template)
interface ProjectPage {
  templateId: ProjectTemplateId;
  meta: ProjectMeta;
  values: Record<string, TemplateValue>;
}

interface Project {            // EXISTING card fields kept as-is
  id; category; categoryLabel; title; desc; image; visible?;
  page?: ProjectPage;          // NEW — optional, back-compatible
}

interface SiteContent {        // add one field
  …existing…
  serviceStyle: ServiceStyleId; // NEW, default 'A'
}
```

- `projects` remains the single project list (cards for `ProjectsPage`, page for detail).
  Adding `page?` is additive — existing rows stay valid.
- No `projectDetails` array is added; the payload lives on the project item so card and
  detail stay in one place.

## 6. Rendering

- **`ProjectDetailPage`**: find project by id → if `project.page`, render
  `projectTemplates[page.templateId].Renderer({meta, values, contact})`; else fall back to
  the existing static `data/project-details.ts` (for the seeded legacy projects) and finally
  the minimal card render. No regression for current URLs.
- **`ServiceDetailPage`**: `serviceSkins[content.serviceStyle](service, contact)`.
- **Home**: `HomePage.tsx` re-implemented to `ThaiViet Home.dc.html`, still driven by the
  existing `home` content block (no schema change unless the new design adds sections — if it
  does, extend `Home` + defaults + editor, per the CLAUDE.md sync rule).

## 7. Admin CMS wiring

Follows the CLAUDE.md "keep docs + dashboard in sync" checklist exactly.

- **Compose wizard** (new sidebar entry "Create content"): Step 1 `TemplatePicker`
  (cards from `projectTemplateList`), Step 2 `TemplateForm` (fields from `sections`) beside
  `TemplatePreview` (the template `Renderer` scaled down, live). "Publish" appends a
  `Project` with `page` populated and returns to the Projects list.
- **Service Pages section**: add `ServiceStyleEditor` — a 3-across grid of style cards
  (A–E) with thumbnail + name + desc, single-select, writes `serviceStyle`. Existing
  per-service content editing (`ServiceDetailsEditor`) stays.
- **Store** (`admin-content-store.tsx`): new actions/helpers
  `SET_SERVICE_STYLE` / `setServiceStyle`, and `ADD_PROJECT_FROM_TEMPLATE` /
  `addProjectFromTemplate(page)`; project edit re-opens the wizard in "build" step when the
  item has a `page`.
- **Sidebar/AdminPage** (`AdminSidebar.tsx`, `AdminPage.tsx`): register "Create content"
  section + `META` entry + render branch.
- **Defaults/validation/schema**: `site-content.json` gets `serviceStyle: 'A'`;
  `withContentDefaults` back-fills it and leaves `page` absent on legacy projects;
  `content-schema.ts` validates `serviceStyle ∈ A–E`, each `page.meta.cover`/image URL is
  `https://`, and delegates per-template field checks to a `validate(page)` helper.

## 8. Back-compat / migration

- Add-only keys + `withContentDefaults` ⇒ no data migration, no key renames.
- `serviceStyle` defaults to `'A'` = current look. Existing services unchanged.
- Legacy projects (no `page`) keep rendering via static `project-details.ts`. **Decision:
  do NOT convert the seeded case studies** — they stay on the static fallback; only new
  projects use templates. (Revisit later if the client wants to edit old case studies.)

## 9. Validation & publish

Unchanged pipeline. `validateContent` additionally: rejects unknown `serviceStyle`; for each
`project.page` runs the template's field validation (required text non-empty, image/cover
`https://`, repeat items well-formed). Publish stays a single upsert of the whole blob.

## 10. Phases (implementation plan will expand these)

1. **Data model + registries scaffolding** — types, empty registries, defaults, back-compat.
2. **Project templates** — 5 template modules (renderers + sections + defaults from design),
   `ProjectDetailPage` dispatch, section renderers. Verify public render.
3. **Compose wizard** — picker + form + live preview + store actions + validation + sidebar.
4. **Service skins** — skins A (current layout) + B (Cinematic/Dark), `ServiceStyleEditor`
   (5-card selector, C/D/E marked "coming soon"), `ServiceDetailPage` dispatch.
5. **Home reskin** — re-implement `HomePage.tsx` to `ThaiViet Home.dc.html`; extend `Home`
   content + editor only if the design adds sections.
6. **Docs + verify** — update `README.md` (routes/components/content-block map) and `docs/`;
   `npm run build` (tsc strict + vite) green.

## 11. Risks

- **Template renderer fidelity to the design** — mitigate by extracting exact markup/copy
  from the `.dc.html` files during Phase 2/4 rather than approximating.
- **Live preview cost** — the preview reuses the real `Renderer`; keep it a plain scaled
  React render (no iframe) to stay simple.
- **File size creep** — split renderer vs. section wiring; one file per template/skin.
- **Home design may introduce new content keys** — if so, follow the CMS-sync rule; do not
  rename existing `home` keys.

## 12. Resolved decisions

1. **Legacy projects:** stay on the static `project-details.ts` fallback — not converted.
2. **Service skins:** ship A (current) + B (Cinematic/Dark) now; C/D/E deferred (selector
   shows them "coming soon").
3. **Sequencing:** template system (Phases 1–4) first, then Home reskin (Phase 5).

## 13. Open question (resolved during implementation)

- Does the new Home design add sections beyond the current `Home` schema? Determined when we
  read `ThaiViet Home.dc.html` in Phase 5; if it does, extend `Home` + defaults + editor per
  the CLAUDE.md CMS-sync rule (no renames of existing keys).
