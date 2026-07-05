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
  templates/  ProjectTemplateRenderer · template-sections   (data-driven project detail renderer)
  services/   ServiceSkinA · ServiceSkinB · BeforeAfter · service-skins   (service-page layout styles)
  ProjectFilter

pages/admin/sections/
  compose/    ComposeWizard · TemplatePicker · TemplateForm · TemplatePreview · TemplatePreviewPanel   (new-project wizard)
  ServiceStyleEditor   (global service-page layout picker)

hooks/     useContactForm
data/      nav · services · projects · project-details · posts · reels · areas
lib/       types.ts · templates/ (registry: types · project-templates · seed · validate-page)
```

## Routes
`/` Home (marketing landing) · `/about` (company story) · `/services` · `/services/:slug` (service detail, all 8 services) · `/projects` · `/projects/:id` (case study) · `/our-work` (service videos & reels) · `/blog` · `/contact` · `/privacy` (privacy policy)

Content blocks are admin-editable and stored in Supabase / bundled `site-content.json`:
- `home` block → landing page (admin → **Homepage**)
- `homepage` block → about page (admin → **About Page** — key kept for content compatibility)
- `serviceDetails[]` → every `/services/:slug` page including Interior (admin → **Service Pages**)
- `serviceStyle` → global service-page layout style `A`–`E` applied to all `/services/:slug` pages (admin → **Service Pages** → "Service page layout"; A + B shipped, C/D/E "coming soon")
- `privacy` block → privacy policy page (`/privacy`, admin → **Privacy Policy**). Title + intro, an ordered list of sections (each with paragraphs + optional bullets), and contact/closing copy. The contact block's email + phone pull live from the `contact` block (Contact & Social), so they never drift.
- `projects[].page` → optional templated project detail content, created via the **Create content** compose wizard (admin sidebar) and rendered on `/projects/:id` by the matching template. Editing a templated project from the **Projects** list re-opens the wizard on that project and saves in place (card fields are derived from the template meta, so the card and detail page never drift)

## Templates (developer-defined)

Two code-registered catalogs, both editable from `/admin`, both stored in the single `site-content.json` blob (no new tables):

- **Project templates** — `src/lib/templates/project-templates.ts`. Each is data only: `id`, picker card (`name`/`icon`/`desc`/`includes`), `defaultMeta`, and `sections[]` (kinds `text` / `pair` / `repeat`). One generic renderer (`components/templates/ProjectTemplateRenderer`) walks `sections[]`; the same renderer powers the admin step-2 live preview and the picker's per-template **Preview** panel — shown inline in the admin content area (sidebar stays visible), Simple scaled overview / Full actual-size, rendered from each template's default content. **Add a template** = append one object to `projectTemplateList` — no renderer changes.
- **Service skins** — `src/components/services/service-skins.tsx`. Each skin is a layout component over the shared `ServiceDetail` data. **Add a skin** = create `ServiceSkin<X>.tsx`, map it in `serviceSkins`, and flip its `ready: true` in `SERVICE_STYLE_META`. Style A = the original layout; B = Cinematic/Dark.

Publish-time validation for templated pages + `serviceStyle` lives in `src/lib/content-schema.ts` (delegates to `src/lib/templates/validate-page.ts`). Pure-logic helpers are unit-tested with Vitest (`npm test`).

## Where to wire real backends
- `hooks/useContactForm.ts` — replace the mock submit with your form endpoint.
- Routing uses `BrowserRouter`; for static hosting add an SPA fallback to `index.html`.

## Notes
- Landing page section order: Hero → Trust → Intro → **See Our Work** (intro video) → **Customer Reviews + Video Reviews** → **Our Services** → Why Choose → Featured Projects → Process → Service Areas → CTA. Reviews sit directly under the video, above the services grid.
- Service cards link to their detail page and share one subtitle source. On both the landing **Our Services** grid and the `/services` page, each card links to `/services/:slug` and shows the matching `serviceDetails[].heroSub` — the same subtitle rendered in the detail-page hero. Edit it once in admin → **Service Pages** and it updates the detail hero and every card (landing card matches by service name; `/services` card by slug; falls back to its own `desc` if no match). No separate CMS field — nothing new to wire.
- All page content lives in `data/*` so you can swap copy/images without touching components.
- `logo.webp` loads from `project.vinapage.com`; drop a local copy in `public/` and update the path in `Header.tsx` for production.
- `ChatWidget` is a single floating **Messenger** button linking to `contact.messenger` (editable in admin → **Contact & Social**). The former support chat + its avatar were removed.
- Video walkthroughs are Facebook iframes (data in `data/reels.ts`): `REVIEWS` render in the homepage Customer Reviews section; `REELS` render on the dedicated **Our Work** page (`/our-work`, "Service Videos & Reels"). Reels data stays static in `data/reels.ts` (not CMS-backed, unchanged by the split).
- The Projects filter is pure client state (`useState` + `useMemo`) in `ProjectsPage.tsx`.
- Project cards link to `/projects/:id`. `ProjectDetailPage` renders, in priority order: (1) a `page` template (if the project was created via the compose wizard) through the project-template registry, else (2) a rich case study from `data/project-details.ts` (keyed by project id), else (3) the base project fields (image, title, category, desc).
