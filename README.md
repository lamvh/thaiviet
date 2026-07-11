# ThaiViet Ltd — React + Vite + TypeScript

Component-based rebuild of the ThaiViet site.

## Run

```bash
cd react-app
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Tailwind is configured via `tailwind.config.js` (brand tokens) + `postcss.config.js`.
Fonts (Manrope / Work Sans) and Material Symbols load from Google Fonts in `index.html`.

## Component tree

```
App (router)
└─ Layout
   ├─ Header
   │  ├─ ServicesDropdown
   │  └─ FacebookIcon
   ├─ <page>            (Routes render here)
   ├─ Footer
   └─ ChatWidget        (floating Messenger button)

pages/
  HomePage (landing) · AboutPage · ServicesPage · ProjectsPage · ProjectDetailPage · BlogPage · OurWorkPage · ContactPage · PrivacyPage

components/
  ui/         Icon · Container · CTASection
  cards/      ServiceCard · ProjectCard · BlogCard · VlogCard
  layout/     Header · Footer · Layout · ChatWidget · ServicesDropdown · FacebookIcon
  templates/  ProjectTemplateRenderer · ServiceTemplateRenderer (both dispatch by each template's layout) · template-sections · project-layouts/ · service-template-layouts/ (Classic/Sidebar/Cinematic/Timeline/Bento/Minimal + shared)
  ProjectFilter

pages/admin/sections/
  compose/          ComposeWizard · TemplatePicker · TemplateForm · TemplatePreview · TemplatePreviewPanel   (new-project wizard)
  service-compose/  ServiceComposeWizard · ServiceTemplatePicker · ServiceTemplateForm · ServiceTemplatePreview   (new-service wizard)
  ServicesTable   (services CRUD list)

hooks/     useContactForm
data/      nav · projects · project-details · posts · reels · areas
lib/       types.ts · migrate-services.ts · templates/ (registry: types · project-templates · service-templates · service-prefill · seed · validate-page)
```

## Routes
`/` Home (marketing landing) · `/about` (company story) · `/services` · `/services/:slug` (service detail — template-only, one page per CMS service) · `/projects` · `/projects/:id` (case study) · `/our-work` (service videos & reels) · `/blog` · `/contact` · `/privacy` (privacy policy)

Content blocks are admin-editable and stored in Supabase / bundled `site-content.json`:
- `home` block → landing page (admin → **Homepage**)
- `homepage` block → about page (admin → **About Page** — key kept for content compatibility)
- `serviceDetails[]` → the CRUD list of services (admin → **Services**). Each entry is a slim card (`slug`/`name`/`icon`/`desc`/`image`) plus a required templated `page` (see Templates § "Service templates"). This one list drives the `/services` grid, the `/services/:slug` detail page, the header + mobile Services menu, the footer Services column and the homepage service cards. Add/edit a service from admin → **Service Templates** (pick a layout → fill fields → publish); the **Services** table toggles visibility and deletes. Card fields derive from the template meta (`desc ← hero subtitle`, `image ← hero image`, `icon`), so the card and detail page never drift. A hidden service (`visible: false`) drops out of every surface and `/services/:slug` redirects to `/services` (each surface filters inline on `visible !== false`). Older DB rows and the bundled defaults are healed at load by `migrateServices()` (`lib/migrate-services.ts`) — legacy "fat" services are back-filled with card fields + a `serviceclassic` page
- `privacy` block → privacy policy page (`/privacy`, admin → **Privacy Policy**). Title + intro, an ordered list of sections (each with paragraphs + optional bullets), and contact/closing copy. The contact block's email + phone pull live from the `contact` block (Contact & Social), so they never drift.
- `projects[].page` → optional templated project detail content, created via the **Project Templates** compose wizard (admin sidebar) and rendered on `/projects/:id` by the matching template. Each template also carries the detail-page **layout** it renders in (see Templates below), so picking a template picks its layout. Editing a templated project from the **Projects** list re-opens the wizard on that project and saves in place (card fields are derived from the template meta, so the card and detail page never drift)

## Templates (developer-defined)

Two code-registered catalogs, both editable from `/admin`, both stored in the single `site-content.json` blob (no new tables):

- **Project templates** — `src/lib/templates/project-templates.ts`. Each is data only: `id`, picker card (`name`/`icon`/`desc`/`includes`), `defaultMeta`, and `sections[]` (kinds `text` / `pair` / `repeat`). One generic renderer (`components/templates/ProjectTemplateRenderer`) walks `sections[]`; the same renderer powers the admin step-2 live preview and the picker's per-template **Preview** panel — shown inline in the admin content area (sidebar stays visible), Simple scaled overview / Full actual-size, rendered from each template's default content. **Add a template** = append one object to `projectTemplateList` — no renderer changes.
- **Service templates** — `src/lib/templates/service-templates.ts` + `src/components/templates/service-template-layouts/`. Mirrors project templates for services: every service is template-only (`serviceDetails[].page`, required). `/services/:slug` renders `page` via `ServiceTemplateRenderer` (dispatch by `template.layout`); there is no legacy skin fallback. Six layouts ship A–F (`serviceclassic` / `servicesidebar` / `servicecinematic` / `servicetimeline` / `servicebento` / `serviceminimal`) — Classic, Sidebar, Cinematic (dark), Process Timeline, Bento Mosaic and Minimal — all sharing one `sections[]` (features / approach body / approach / before-after / gallery / showcase / quote / author) and differing only by layout + picker card meta. Layouts render a subset of those sections; `LAYOUT_SECTIONS` (in `service-skins-templated.tsx`) is the per-layout allow-list that gates which editor cards show — switching layouts never drops stored values. Create/edit services in admin → **Service Templates** (`ServiceComposeWizard`): pick a layout, fill the `ServiceMeta` (slug/name/icon/hero/intro) + section fields, live-preview, publish. Body sections reuse `SectionDef`/`SectionView`. **Add a template** = append to `serviceTemplateList`; **add a layout** = create `ServiceLayout<X>.tsx`, map it in `serviceTemplateLayouts`, flip `ready` in `SERVICE_TEMPLATE_LAYOUT_META`.
- **Project detail layouts** — `src/components/templates/project-skins.tsx` + `src/components/templates/project-layouts/`. Each layout (`ProjectLayout<Name>.tsx`) is a skin over the shared templated-project data (`meta` + `values` + `sections`, rendered through the same `SectionView`); shared hero/facts/CTA live in `project-layouts/shared.tsx`. A project template binds to a layout via its optional `layout: ProjectStyleId` field (default `A`), and `ProjectTemplateRenderer` dispatches to that skin — so choosing a template in the Project Templates wizard chooses its detail-page layout. **Add a layout** = create `ProjectLayout<X>.tsx`, map it in `projectLayouts`, and flip its `ready: true` in `PROJECT_STYLE_META`; then point a template's `layout` at it. A Classic / B Sidebar / C Before-After focus / E Bento mosaic / F Minimal centered ship (templates `sidebar` / `beforeafterfocus` / `bento` / `minimal`); D falls back to Classic ("coming soon").

Publish-time validation for templated pages lives in `src/lib/content-schema.ts` (delegates to `src/lib/templates/validate-page.ts`). Services are validated as template items: each needs a unique lowercase-hyphen `slug` and a `page`. Pure-logic helpers are unit-tested with Vitest (`npm test`).

## Media uploads (Supabase Storage)

Admin image/video fields accept a pasted `https://` URL, an in-place **Upload** button that pushes a new file to Supabase Storage, **or** a **Library** button that opens a picker to choose a file already in Storage. Both write the resulting public URL back into the field. Uploads go through `src/lib/storage.ts` (`uploadMedia(file, kind)` → public URL); the **Library** picker (`sections/media-picker.tsx`, `MediaPickerButton`) lists the bucket via `listMedia()` and filters by the field's kind (image fields show only images). The upload control + thumbnail preview live in `homepage-editor-primitives.tsx` (`UploadButton`, `MediaPreview`); both controls are opted into per field via the `Field`/`StringList` `upload="image" | "video"` prop, so every editor built on those primitives — Homepage, About, Service pages, and the Project/Service **template** compose form — gets Upload + Library automatically. `EditDrawer` (project/post images) and `HeroEditor` wire the same two controls inline; the Project/Service **template** compose form auto-detects image/video sub-fields via `guessMediaKind(label, key)` (override with a `media` flag on a template `FieldDef`).

Images are compressed in-browser before upload (`src/lib/image-compression.ts`, `compressImage`) to save Storage: resized to ≤1920px longest edge and re-encoded to WebP (quality 0.82), respecting EXIF orientation. Animated GIFs and SVGs pass through untouched, and if compression doesn't actually shrink the file the original is kept. Videos are never compressed client-side.

Because uploaded URLs are `https://`, they already satisfy the existing content validation. Uploading from a content field adds no new content key or type — it's an input method on existing fields.

### Media Library (`/admin/media`)

A dedicated admin section (`sections/MediaLibrary.tsx`, sidebar **Media Library**) that browses the whole bucket as a grid and manages files directly on Storage: **view** all images/videos, **upload** new files, **replace** a file's contents, **delete**, and **copy URL** (to paste into any content field). It talks to Storage via `src/lib/storage.ts` — `listMedia()`, `deleteMedia(paths)`, `replaceMedia(item, file)`. Because these act on Storage (not the content row) they take effect immediately and are **not** gated by Publish. **Replace** overwrites the object in place (`upsert`), so the public URL is unchanged and every page using it updates automatically — the only caveat is that already-cached browsers may show the old file until their cache expires (the grid preview is cache-busted so the admin sees it immediately). **Delete** removes the URL, so a file still referenced by a page will break until re-pointed — the UI warns first. The library needs the `anon` Storage policy to allow `SELECT` (list), `UPDATE` (replace/upsert) and `DELETE`, in addition to `INSERT` for uploads.

**One-time setup (Supabase dashboard):** create a **public** bucket whose name matches `VITE_SUPABASE_MEDIA_BUCKET` (defaults to `media`; Storage → New bucket → Public). Set a file-size limit (client guards: 8 MB images / 100 MB video). Since the admin login is a temporary client-side password (not Supabase Auth), add a Storage policy allowing the `anon` role to `INSERT` into the bucket so browser uploads succeed. This means anyone with the public anon key could upload — acceptable short-term; tighten by wiring real Supabase Auth and restricting the policy to `authenticated`. Uploads reuse `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`; the bucket name is the only optional extra var.

## Where to wire real backends
- `hooks/useContactForm.ts` — replace the mock submit with your form endpoint.
- Routing uses `BrowserRouter`; for static hosting add an SPA fallback to `index.html`.

## Notes
- Landing page section order: Hero → Trust → Intro → **See Our Work** (intro video) → **Customer Reviews + Video Reviews** → **Our Services** → Why Choose → Featured Projects → Process → Service Areas → CTA. Reviews sit directly under the video, above the services grid.
- Service cards link to their detail page and share one subtitle source. On both the landing **Our Services** grid and the `/services` page, each card links to `/services/:slug` and shows the service's `desc` (derived from its page hero subtitle). Edit the hero subtitle once in admin → **Service Templates** and it updates the detail hero and every card. No separate CMS field — nothing new to wire.
- Mobile padding convention: page/section containers use `px-5 sm:px-8` (20px gutter on phones, 32px from the `sm` breakpoint up) — apply this to any new `max-w-* mx-auto` container or full-bleed `<section>` wrapper. CTA buttons/pills keep their own fixed `px-8 py-4` (do not make button padding responsive). Image hero sections use `min-h-[…]` (not fixed `h-[…]`) so long titles/CTAs grow the hero on small screens instead of clipping under `overflow-hidden`.
- All page content lives in `data/*` so you can swap copy/images without touching components.
- `logo.webp` loads from `project.vinapage.com`; drop a local copy in `public/` and update the path in `Header.tsx` for production.
- `ChatWidget` is a single floating **Messenger** button linking to `contact.messenger` (editable in admin → **Contact & Social**). The former support chat + its avatar were removed.
- Footer nav (`Footer.tsx`, static `COMPANY` array, not CMS-backed): the **Company** column links Home · About · **Services** (`/services`) · **Why Choose Us** (`/#why-choose-us`) · **Process** (`/#process`) · Projects. The two `/#…` links are in-page anchors to the matching homepage sections (each `<section>` carries a matching `id` + `scroll-mt-[72px]`). Hash scrolling is handled by `ScrollToTop` in `Layout.tsx`, which `scrollIntoView`s the target (retrying via `requestAnimationFrame` when navigating in from another page so the section has time to mount).
- Header nav: desktop (`lg`+) shows a hover `ServicesDropdown`; the mobile menu (`<lg`) renders an expandable **Services** group (`MobileServices` in `Header.tsx`) plus an **All Services** link to `/services`. Both derive their flat list from the visible `serviceDetails` (CMS-backed), so the menu, footer and grid never drift.
- The Projects filter is pure client state (`useState` + `useMemo`) in `ProjectsPage.tsx`.
- Project cards link to `/projects/:id`. `ProjectDetailPage` renders, in priority order: (1) a `page` template (if the project was created via the compose wizard) through the project-template registry — laid out by that template's own `layout` skin (see Templates § "Project detail layouts") — else (2) a rich case study from `data/project-details.ts` (keyed by project id), else (3) the base project fields (image, title, category, desc). The layout skin applies only to the templated path (1); the legacy case-study/base paths keep their own fixed layout.
