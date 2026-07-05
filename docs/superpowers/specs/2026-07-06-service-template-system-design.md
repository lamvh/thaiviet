# Service Template System — Design Spec

- **Date:** 2026-07-06
- **Status:** Approved (design) — pending implementation plan
- **Author:** brainstorming session
- **Related:** existing Project Template system (`src/lib/templates/`, `src/components/templates/`), Service skins (`src/components/services/`)

## 1. Problem & Goal

Service detail pages (`/services/:slug`) are currently rendered from a fixed, richly-typed `serviceDetails[]` object through a global skin picker (`serviceStyle` A/B). The client wants services to work **like projects**: a catalog of **templates**, each carrying its own **layout/design**, where the user **picks a template and fills in data**.

**Goal:** introduce a service-template system that mirrors the project-template pattern, **gradually replacing** the `serviceDetails + skin` rendering, and **migrate a few existing services** onto templates now. The concrete visual design of each template is provided by the client **later**; this iteration ships the infrastructure + a **starter template that reproduces the current Skin A layout** so migration is visually lossless.

### Non-goals (this iteration)
- Designing brand-new service layouts beyond the starter (client supplies designs later → added as new templates/layouts incrementally).
- Removing the `serviceDetails + skin A/B` system. It stays as the fallback during gradual replacement.
- Adding/removing services (the service set stays fixed, mirroring the nav).

## 2. Chosen approach

**Hướng A — mirror the project engine, reuse `SectionDef`/`SectionView`.** Rejected: B (generic engine shared with projects → risky refactor of working code), C (separate service engine → duplicated machinery).

**Create-flow fork:** **(a)** a **"Use a template"** action inside each service in the **Service Pages** editor (in-context; services are a fixed set so we apply a template to an existing service rather than creating a new entry). Rejected (b) a separate sidebar wizard section.

## 3. Architecture

### 3.1 Rendering priority (`ServiceDetailPage`)
1. `s.visible === false` → `Navigate` to `/services` (already implemented).
2. `s.page` present → `ServiceTemplateRenderer` (dispatch by `template.layout`).
3. else → existing `serviceSkins[serviceStyle]` (unchanged fallback).

### 3.2 Data model (reuse the template engine)
- `ServiceMeta = { name, heroTitle, heroSub, heroImg, introTitle, intro }` — hero/intro block.
- `ServicePage = { templateId: ServiceTemplateId, meta: ServiceMeta, values: Record<string, TemplateValue> }`.
- Add `page?: ServicePage` to `ServiceDetail` (mirrors `Project.page`). Backward compatible (optional).
- `ServiceTemplateDef = { id, name, icon, desc, includes[], layout: ServiceStyleId, defaultMeta: ServiceMeta, sections: SectionDef[] }` in a new `serviceTemplateList` (mirrors `projectTemplateList`).
- **Reuse** `SectionDef` + `SectionView`. Add service-oriented section styles to `SectionView`:
  - `features` (repeat: icon/title/desc grid),
  - `approach` (eyebrow + title + image + paragraphs + checklist),
  - `showcase` (repeat: title/blurb/image cards),
  - reuse existing `pair`/`beforeafter`, `gallery`, and `quote`/`author`.

### 3.3 Components / files
- `src/lib/templates/service-templates.ts` — `serviceTemplateList` + `serviceTemplates` map.
- `src/lib/templates/types.ts` — add `ServiceMeta`, `ServicePage`, `ServiceTemplateId`, `ServiceTemplateDef`; extend section styles.
- `src/components/templates/service-template-layouts/` — `ServiceLayoutClassic.tsx` (Layout A = reproduces Skin A), `shared.tsx` (hero/CTA), future layouts.
- `src/components/templates/service-skins-templated.tsx` — `serviceTemplateLayouts` registry + `SERVICE_TEMPLATE_LAYOUT_META` (ready flags), keyed by `ServiceStyleId`.
- `src/components/templates/ServiceTemplateRenderer.tsx` — thin dispatcher (by `template.layout`).
- `src/components/templates/template-sections.tsx` — extend `SectionView` with the new service styles (shared with projects).
- `src/lib/templates/validate-page.ts` — `validateServicePage()` alongside `validateProjectPage()`.

### 3.4 Starter template (Layout A)
`ServiceLayoutClassic` renders the same sections/visual as `ServiceSkinA`: hero → intro/"What's included" → features grid → approach section (image + checklist + paint partners) → before/after + gallery → project showcase → testimonial → CTA. Expressed via `ServiceMeta` (hero/intro) + `sections[]` (features/approach/pair/gallery/showcase/quote). This guarantees migrated services look identical until new designs arrive.

### 3.5 Admin (fork a)
In `ServiceDetailsEditor`, per selected service add a **"Use a template"** control:
- If the service has no `page`: show template picker (cards from `serviceTemplateList`, reuse `TemplatePicker`/`TemplatePreviewPanel` patterns) → on pick, seed `page` from the template's `defaultMeta`/sections (prefill from the service's existing `serviceDetails` where fields map: name/heroTitle/heroSub/heroImg/intro).
- If the service has a `page`: show the compose form (reuse `TemplateForm`/`TemplatePreview`) editing `page.meta`/`page.values`, plus a "Remove template (revert to classic)" action that clears `page`.

CMS wiring (mandatory, mirrors serviceStyle/project compose):
- `admin-content-store.tsx` — actions to set/clear a service `page` + update its meta/values (or extend `updateServiceDetails`).
- `content-schema.ts` — call `validateServicePage(s.page)` for each service that has one.
- `site-content.json` — no default `page` needed (optional); no migration required for un-templated services.
- `useAdminContent.ts` — no new top-level field (page lives inside `serviceDetails[]`).

### 3.6 Migration (this iteration)
Attach a starter-template `page` to **interior** and **exterior** in `site-content.json`, porting their existing `serviceDetails` content into `meta`+`values`. Because Layout A = Skin A, the public pages render identically.

## 4. Testing
- Unit: `serviceTemplateList` integrity (ids unique, each `layout` maps to a ready renderer), `validateServicePage` (https image checks, required fields), section-style rendering for new styles.
- `npm run build` (tsc strict + vite) green; `vitest` green.
- Manual: `/services/interior` + `/services/exterior` visually identical pre/post migration; admin "Use a template" round-trips; hidden services still redirect.

## 5. Risks & mitigations
- **Rich service content → generic sections:** mitigate by adding the 3 service-specific section styles; keep `ServiceMeta` for hero/intro.
- **Migration visual drift:** mitigate by making Layout A a faithful Skin A reproduction; verify interior/exterior pixel-parity before shipping.
- **Two rendering systems coexist:** intentional (gradual replacement); priority order in `ServiceDetailPage` keeps it deterministic.

## 6. Out of scope / later
- Client-provided designs → new templates + `service-template-layouts/*` + flip `ready` in `SERVICE_TEMPLATE_LAYOUT_META`.
- Migrating the remaining 6 services.
- Eventually retiring `serviceStyle` skins once all services are templated.

## Open questions
- None blocking. (Confirm interior + exterior as the first two migrations — assumed.)
